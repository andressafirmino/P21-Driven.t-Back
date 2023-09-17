import { requestError } from "@/errors";
import { request } from "./request";

export default async function validateCep(cep: number) {
    const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
  console.log(result)
  if(result.data.message || result.data.erro) throw requestError(400, "Bad Request");

  return result.data;
}