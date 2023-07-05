import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { userDto } from "src/users/dto/create-user.dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/registration")
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: userDto.Basic
  ) {
    const userData = await this.authService.register(
      userDto
    );
    this.setRefreshTokenCookie(res, userData.refreshToken);
    return userData;
  }

  @Post("/login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() userDto: userDto.Basic
  ) {
    const userData = await this.authService.login(userDto);
    console.log(userData);

    this.setRefreshTokenCookie(res, userData.refreshToken);
    return userData;
  }

  @Get("/logout")
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken } = req.cookies;
    await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return;
  }

  @Get("/refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(
      refreshToken
    );

    this.setRefreshTokenCookie(res, userData.refreshToken);
    return userData;
  }

  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string
  ): void {
    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
}
