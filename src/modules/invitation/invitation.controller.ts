import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/common/http-exception.filter';
import { Invitation } from './invitation.model';
import { InvitationService } from './invitation.service';

@Controller('invitation')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard('jwt'))
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createInvitation(
    @Body('email') email: string,
    @Req() request: any,
  ): Promise<Invitation> {
    const sentBy = request.user._id;
    const invitation = await this.invitationService.createInvitation(
      email,
      sentBy,
    );
    return invitation;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllInvitations(@Req() request: any): Promise<Invitation[]> {
    const sentBy = request.user._id;
    console.log({ sentBy });
    const invitations = await this.invitationService.getAllInvitations(sentBy);
    return invitations;
  }

  @Get(':email')
  @UseGuards(AuthGuard('jwt'))
  async getInvitation(
    @Param('email') email: string,
    @Req() request: any,
  ): Promise<Invitation> {
    const sentBy = request.user._id;
    const invitation = await this.invitationService.getInvitationByEmail(
      email,
      sentBy,
    );
    return invitation;
  }

  @Patch(':email')
  @UseGuards(AuthGuard('jwt'))
  async updateInvitationStatus(
    @Param('email') email: string,
    @Body('status') status: 'failed' | 'pending' | 'accepted' | 'rejected',
  ): Promise<Invitation> {
    const invitation = await this.invitationService.updateInvitationStatus(
      email,
      status,
    );
    return invitation;
  }
}
