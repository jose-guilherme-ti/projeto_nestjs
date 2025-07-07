import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { CorreiosController } from './correios.controller';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from 'src/city/city.module';
import { SoapModule } from 'nestjs-soap';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    /* SoapModule.register({
      clientName: 'SOAP_TEST',
      uri: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL',
    }), */
    ConfigModule,
    SoapModule.register({
      clientName: 'SOAP_CORREIOS',
      uri: 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CityModule,
  ],
  providers: [CorreiosService],
  controllers: [CorreiosController],
  exports: [CorreiosService],
})
export class CorreiosModule { }