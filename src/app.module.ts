import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutingModule } from './modules/routing/routing.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RoutingModule,
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible globalmente
      envFilePath: '.env', // Ruta al archivo .env
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
