import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const cursos = pgTable("cursos", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  imagenSrc: text("imagen_src").notNull(),
});

export const cursosRelaciones = relations(cursos, ({ many }) => ({
  progresoUsuario: many(progresoUsuario),
  unidades: many(unidades),
}));

export const unidades = pgTable("unidades", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  cursoId: integer("curso_id").references(() => cursos.id, { onDelete: "cascade" }).notNull(),
  orden: integer("orden").notNull(),
});

export const unidadesRelaciones = relations(unidades, ({ many, one }) => ({
  curso: one(cursos, {
    fields: [unidades.cursoId],
    references: [cursos.id],
  }),
  lecciones: many(lecciones),
}));

export const lecciones = pgTable("lecciones", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  unidadId: integer("unidad_id").references(() => unidades.id, { onDelete: "cascade" }).notNull(),
  orden: integer("orden").notNull(),
});

export const leccionesRelaciones = relations(lecciones, ({ one, many }) => ({
  unidad: one(unidades, {
    fields: [lecciones.unidadId],
    references: [unidades.id],
  }),
  desafios: many(desafios),
}));

export const desafiosEnum = pgEnum("tipo", ["SELECCIONAR", "ASISTIR"]);

export const desafios = pgTable("desafios", {
  id: serial("id").primaryKey(),
  leccionId: integer("leccion_id").references(() => lecciones.id, { onDelete: "cascade" }).notNull(),
  tipo: desafiosEnum("tipo").notNull(),
  pregunta: text("pregunta").notNull(),
  orden: integer("orden").notNull(),
});

export const desafiosRelaciones = relations(desafios, ({ one, many }) => ({
  leccion: one(lecciones, {
    fields: [desafios.leccionId],
    references: [lecciones.id],
  }),
  opcionesDesafio: many(opcionesDesafio),
  progresoDesafio: many(progresoDesafio),
}));

export const opcionesDesafio = pgTable("opciones_desafio", {
  id: serial("id").primaryKey(),
  desafioId: integer("desafio_id").references(() => desafios.id, { onDelete: "cascade" }).notNull(),
  texto: text("texto").notNull(),
  correcto: boolean("correcto").notNull(),
  imagenSrc: text("imagen_src"),
  audioSrc: text("audio_src"),
});

export const opcionesDesafioRelaciones = relations(opcionesDesafio, ({ one }) => ({
  desafio: one(desafios, {
    fields: [opcionesDesafio.desafioId],
    references: [desafios.id],
  }),
}));

export const progresoDesafio = pgTable("progreso_desafio", {
  id: serial("id").primaryKey(),
  usuarioId: text("usuario_id").notNull(),
  desafioId: integer("desafio_id").references(() => desafios.id, { onDelete: "cascade" }).notNull(),
  completado: boolean("completado").notNull().default(false),
});

export const progresoDesafioRelaciones = relations(progresoDesafio, ({ one }) => ({
  desafio: one(desafios, {
    fields: [progresoDesafio.desafioId],
    references: [desafios.id],
  }),
}));

export const progresoUsuario = pgTable("progreso_usuario", {
  usuarioId: text("usuario_id").primaryKey(),
  nombreUsuario: text("nombre_usuario").notNull().default("Usuario"),
  imagenUsuarioSrc: text("imagen_usuario_src").notNull().default("/mascot.svg"),
  cursoActivoId: integer("curso_activo_id").references(() => cursos.id, { onDelete: "cascade" }),
  corazones: integer("corazones").notNull().default(5),
  puntos: integer("puntos").notNull().default(0),
});

export const progresoUsuarioRelaciones = relations(progresoUsuario, ({ one }) => ({
  cursoActivo: one(cursos, {
    fields: [progresoUsuario.cursoActivoId],
    references: [cursos.id],
  }),
}));
