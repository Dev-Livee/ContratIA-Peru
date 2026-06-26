import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Formato de correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const registroSchema = z.object({
  tipoCuenta: z.enum(['entidad', 'empresa'], { message: 'Selecciona un tipo de cuenta' }),
  ruc: z.string().length(11, 'El RUC debe tener 11 dígitos').regex(/^\d+$/, 'Solo números'),
  razonSocial: z.string().min(3, 'Razón social requerida'),
  correo: z.string().min(1, 'Correo requerido').email('Correo inválido'),
  dniRepresentante: z.string().length(8, 'El DNI debe tener 8 dígitos').regex(/^\d+$/, 'Solo números'),
  nombreRepresentante: z.string().min(3, 'Nombre requerido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
export type RegistroSchema = z.infer<typeof registroSchema>;

export const proyectoSchema = z.object({
  nombre: z.string().min(5, 'Mínimo 5 caracteres'),
  descripcion: z.string().min(20, 'Mínimo 20 caracteres'),
  rubro: z.string().min(1, 'Selecciona un rubro'),
  distrito: z.string().min(1, 'Selecciona un distrito'),
  presupuesto: z.number().positive('Debe ser mayor a 0'),
  fechaInicio: z.string().min(1, 'Selecciona fecha de inicio'),
  fechaFin: z.string().min(1, 'Selecciona fecha de fin'),
  descripcionTecnica: z.string().min(10, 'Mínimo 10 caracteres').optional().or(z.literal('')),
  experienciaMinima: z.number().min(0).optional(),
});
export type ProyectoSchema = z.infer<typeof proyectoSchema>;

export const perfilEmpresaSchema = z.object({
  representante: z.string().min(3, 'Nombre requerido'),
  correoContacto: z.string().email('Correo inválido'),
  rubros: z.array(z.string()).min(1, 'Selecciona al menos un rubro'),
  regiones: z.array(z.string()).min(1, 'Selecciona al menos una región'),
  descripcion: z.string().min(20, 'Mínimo 20 caracteres').optional().or(z.literal('')),
});
export type PerfilEmpresaSchema = z.infer<typeof perfilEmpresaSchema>;
