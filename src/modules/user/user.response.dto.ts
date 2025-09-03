import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 200 })
  statuscode: number;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}
export class UserListResponseDto {
  @ApiProperty({ example: 200 })
  statuscode: number;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}
