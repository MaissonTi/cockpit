'use server'

import { validateAction, validateActionZod } from '@/helper/validate-action';
import UserService from "@/services/user.service";
import { z } from 'zod';

const userCreateSchema = z
.object({
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Please, enter your full name',
  }),
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z
    .string()
    .min(6, { message: 'Password should have at least 6 characters.' }),
  password_confirmation: z.string(),
})
.refine((data) => data.password === data.password_confirmation, {
  message: 'Password confirmation does not match.',
  path: ['password_confirmation'],
})

export type UserCreateSchema = z.infer<typeof userCreateSchema>

export async function userCreateAction(formData: FormData) {

  const { errors, message, success, data } = await validateActionZod({
    data: formData,
    schema: userCreateSchema,
    service: UserService.create,
  })

  return { errors, message, success, data }
}

// ---------------------------------------------------------

const userUpdateSchema = z
.object({
  id: z.string(),
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Please, enter your full name',
  })
})
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>

export async function userUpdateAction(formData: FormData) {
  const { errors, message, success, data } = await validateActionZod({
    data: formData,
    schema: userUpdateSchema,
    service: UserService.update,
  })

  return { errors, message, success, data }
}

// ---------------------------------------------------------

export async function userDeleteAction(formData: FormData) {
  const { errors, message, success, data } = await validateAction({
    data: formData,
    service: UserService.delete,
  })

  return { errors, message, success, data }
}

