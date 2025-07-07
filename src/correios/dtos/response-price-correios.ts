/* export interface ResponsePriceCorreios {
  CalcPrecoPrazoResult: CalcPrecoPrazoResult;
}

export interface CalcPrecoPrazoResult {
  Servicos: Servicos;
}

export interface Servicos {
  cServico: CServico[];
}

export interface CServico {
  Codigo: number;
  Valor: string;
  PrazoEntrega: string;
  ValorMaoPropria: string;
  ValorAvisoRecebimento: string;
  ValorValorDeclarado: string;
  EntregaDomiciliar: string;
  EntregaSabado: string;
  Erro: string;
  MsgErro: string;
  ValorSemAdicionais: string;
  obsFim: string;
} */
export interface ResponsePriceCorreios {
  CalcPrecoPrazoResult: {
    Servicos: {
      cServico: CServico[];
    };
  };
}

export interface CServico {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  ValorSemAdicionais?: string;
  ValorMaoPropria?: string;
  ValorAvisoRecebimento?: string;
  ValorValorDeclarado?: string;
  EntregaDomiciliar?: string;
  EntregaSabado?: string;
  Erro?: string;
  MsgErro?: string;
}