import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: "eXaMpLeAcCeSsToKeN"
  })
  accessToken: string;

  @ApiProperty({
    example: "eXaMpLeReFrEsHtOkEn"
  })
  refreshToken: string;
}