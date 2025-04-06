export class CreateClubDto {
  readonly name: string;
  readonly description: string;
  readonly adminId: string;
  readonly numberOfPeople: number;  // Number of people (maximum members)
  readonly applicationForm: any[];  // Application form structure
}
