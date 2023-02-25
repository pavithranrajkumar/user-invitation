import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import validator from 'validator';
import { MailerService } from '../../mailer/mailer.service';
import { Invitation } from './invitation.model';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel('Invitation')
    private readonly invitationModel: Model<Invitation>,
    private readonly mailerService: MailerService,
  ) {}

  async createInvitation(email: string, sentBy: string): Promise<Invitation> {
    if (!validator.isEmail(email)) {
      throw new BadRequestException('Invalid email address');
    }
    const existingInvitation = await this.invitationModel
      .findOne({ email })
      .exec();
    if (existingInvitation) {
      throw new BadRequestException(
        'Invitation already exists for the provided email',
      );
    }

    const invitationCode = Math.random().toString(36).substr(2, 8); // generate a random invitation code
    const invitation = new this.invitationModel({
      email,
      invitationCode,
      status: 'pending',
      sentBy,
    });

    try {
      await this.mailerService.sendInvitationEmail(email, invitationCode);
    } catch (err) {
      console.log(err);
      invitation.status = 'failed';
      throw new BadRequestException(
        `Failed to send invitation email to ${email}. Please verify your email or contact the administrator.`,
      );
    }
    await invitation.save();
    return invitation;
  }

  async getInvitationByEmail(
    email: string,
    sentBy: string,
  ): Promise<Invitation> {
    return this.invitationModel.findOne({ email, sentBy }).exec();
  }

  async updateInvitationStatus(
    email: string,
    status: 'failed' | 'pending' | 'accepted' | 'rejected',
  ): Promise<Invitation> {
    return this.invitationModel
      .findOneAndUpdate({ email }, { status }, { new: true })
      .exec();
  }

  async getAllInvitations(sentById: string): Promise<Invitation[]> {
    return await this.invitationModel.find({ sentBy: sentById }).exec();
  }
}
