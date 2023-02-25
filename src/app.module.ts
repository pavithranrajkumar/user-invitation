import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerService } from './mailer/mailer.service';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { LocalStrategy } from './modules/auth/local.strategy';
import { InvitationController } from './modules/invitation/invitation.controller';
import { InvitationSchema } from './modules/invitation/invitation.model';
import { InvitationService } from './modules/invitation/invitation.service';
import { UserController } from './modules/user/user.controller';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invitation', schema: InvitationSchema },
    ]),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      loggerLevel: 'debug',
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
  ],

  controllers: [AppController, InvitationController, UserController],
  providers: [
    AppService,
    InvitationService,
    MailerService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
