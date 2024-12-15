import {validateLoginReqPayload} from '../../utils/validators/auth.validator';

export async function validateLoginCredentials(
  credentials: ReturnType<typeof validateLoginReqPayload>,
) {
  console.log(credentials);
  return true;
}
