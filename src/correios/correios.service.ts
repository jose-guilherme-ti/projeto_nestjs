import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { CityService } from 'src/city/city.service';
import { ReturnCepExternal } from './dtos/return-cep-external.dto';
import { ReturnCep } from './dtos/return-cep.dto';
import { CityEntity } from 'src/city/entities/city.entity';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreios } from './dtos/response-price-correios';
import { SizeProductDTO } from './dtos/size-product.dto';
import { CdFormatEnum } from './enum/cd_format.enum';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CorreiosService {
  private readonly isMockEnabled: boolean
  URL_CORREIOS = process.env.URL_CEP_CORREIOS || "";
  CEP_COMPANY = process.env.CEP_COMPANY;
  constructor(
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
    private readonly configService: ConfigService,
  ) {
    this.isMockEnabled = this.configService.get('USE_MOCK_CORREIOS') === 'true';
  }
  async priceDelivery(
    cdService: string,
    cep: string,
    sizeProduct: SizeProductDTO,
  ): Promise<ResponsePriceCorreios> {
    if (this.isMockEnabled) {
      return {
        CalcPrecoPrazoResult: {
          Servicos: {
            cServico: [
              {
                Codigo: cdService,
                Valor: '35,90',
                PrazoEntrega: '5',
                EntregaDomiciliar: 'S',
                EntregaSabado: 'N',
                Erro: '0',
                MsgErro: '',
              },
            ],
          },
        },
      };
    }
    const [result] = await this.soapClient.CalcPrecoPrazoAsync({
      nCdServico: cdService,
      sCepOrigem: this.CEP_COMPANY,
      sCepDestino: cep,
      nCdFormato: CdFormatEnum.BOX,
      nVlPeso: sizeProduct.weight,
      nVlComprimento: sizeProduct.length,
      nVlAltura: sizeProduct.height,
      nVlLargura: sizeProduct.width,
      nVlDiametro: sizeProduct.diameter,
      nCdEmpresa: '',
      sDsSenha: '',
      sCdMaoPropria: 'N',
      nVlValorDeclarado: sizeProduct.productValue < 25 ? 0 : sizeProduct.productValue,
      sCdAvisoRecebimento: 'N',
    });

    return result;
  }

  async findAddressByCep(cep: string): Promise<ReturnCep> {
    const returnCep: ReturnCepExternal = await this.httpService.axiosRef
      .get<ReturnCepExternal>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException('CEP not found');
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    return new ReturnCep(returnCep, city?.id, city?.state?.id);
  }
}