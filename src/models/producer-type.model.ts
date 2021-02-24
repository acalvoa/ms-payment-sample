export interface ProducerType {
  readonly id?: number;
  readonly name: string;
  readonly commission: number;
  readonly default: boolean;
  readonly discount: boolean;
}