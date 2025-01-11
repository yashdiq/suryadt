import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty({
    description: 'Location',
    example: 'Jakarta, Indonesia',
  })
  location?: string;

  @ApiProperty({
    description: 'String date with format yyyy-MM-dd (eg: 2000-10-11)',
    example: '2000-10-11',
  })
  birthdayAt?: string;

  @ApiProperty({
    description: 'Timezone in IANA format',
    example: 'Asia/Shanghai',
  })
  timezone: string;

  publishMessageExp?: string;
}
