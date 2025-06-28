import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { randomUUID } from 'crypto';
import { CreateTeamMemberBody } from './dtos/create-item-member';
import { RocketMembersRepository } from './repositories/rocket-members-repository';

@Controller('app')
export class AppController {
  constructor(
    private rocketMemberRepository: RocketMembersRepository
  ) {}

 //@Get('hello')
  //getHello(): string {
  //  return this.appService.getHello();
    //return 'Hello World';
  //}
  @Get('hello')
  async getHello() {
    return 'Hello World';
  }


  @Post('hello')
  async postHello(@Body() body:CreateTeamMemberBody) {
    const {name, 'function': memberfunction}  = body 

    await this.rocketMemberRepository.create(name, memberfunction)

    /*const member = await this.prisma.rocketTeamMember.create({
        data:{
          id: randomUUID(),
          name,
          function: memberfunction
        }
    })*/
    /*return {
      member
    }*/
    //return 'Hello World';
  }
}
