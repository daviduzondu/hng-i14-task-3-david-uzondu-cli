export const Gender = {
  female: "female",
  male: "male",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export const AgeGroup = {
  child: "child",
  teenager: "teenager",
  adult: "adult",
  senior: "senior",
} as const;
export type AgeGroupType = (typeof AgeGroup)[keyof typeof AgeGroup];

export interface SuccessResponse {
  status: "success";
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  count?: number;
  data: {
    id?: string;
    name?: string;
    gender?: Gender;
    gender_probability?: number;
    age?: number;
    age_group?: AgeGroupType;
    country_id?: string;
    country_probability?: number;
    country_name?: string;
    created_at?: string | Date;
  };
}

export interface ErrorResponse {
  status: "error";
  message: string;
}
