import {z} from 'zod';

export function validateLoginReqPayload(data: unknown) {
  return z
    .object({
      username: z.string({required_error: 'username required'}).trim().min(1),
      password: z.string({required_error: 'password required'}).trim().min(1),
    })
    .parse(data);
}
