import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  birthdayAt: string;

  @ApiProperty()
  publishMessageExp: string;
}
