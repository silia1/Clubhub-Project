// src/club/dto/ManageApplication.dto.ts
export class ManageApplicationDto {
  applicationId: string;  // The application ID to manage
  status: string;         // The status to set (e.g., 'accepted' or 'rejected')
}
