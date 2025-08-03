import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Employee } from 'src/entity/emp.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretkey123',
    });
  }

  async validate(payload: any): Promise<Employee> {
    return { 
      id: payload.sub, 
      email: payload.email,
      name: payload.name,
    } as Employee;
  }
}