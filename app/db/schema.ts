import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const filters = sqliteTable("filters", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid(12)),
  filterBy: text("filter_by").notNull(),
  filterValue: text("filter_value").notNull(),
  calendarId: text("calendar_id").notNull(),
});
export type Filter = typeof filters.$inferSelect;
export type FilterInsert = typeof filters.$inferInsert;

export const filtersRelations = relations(filters, ({one}) => ({
	calendar: one(calendars, {
		fields: [filters.calendarId],
		references: [calendars.id]
	})
}))

export const calendars = sqliteTable("calendars", {
  id: text("id")
    .primaryKey()
    .$default(() => nanoid(12)),
  name: text("name").notNull(),
  sourceUrl: text("source_url").notNull(),
	userId: text("user_id").notNull()
});
export type Calendar = typeof calendars.$inferSelect;
export type CalendarInsert = typeof calendars.$inferInsert;

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  filters: many(filters),
	user: one(users, {
		fields: [calendars.userId],
		references: [users.id],
	}),
}));

export const users = sqliteTable("users", {
	id: text("id")
		.primaryKey()
		.$default(() => nanoid(12)),
	email: text("email").notNull().unique(),
	passwordHash: text("passwordHash").notNull()
});
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
