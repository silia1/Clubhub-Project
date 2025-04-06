import { Test, TestingModule } from '@nestjs/testing';
import { InterestedMembersService } from './interested-members.service';

describe('InterestedMembersService', () => {
  let service: InterestedMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestedMembersService],
    }).compile();

    service = module.get<InterestedMembersService>(InterestedMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
