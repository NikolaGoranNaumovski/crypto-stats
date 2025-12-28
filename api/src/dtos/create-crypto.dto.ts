export class CreateCryptoDto {
  symbol: string;
  name: string;
  active?: boolean = true;
  source?: string;
}
