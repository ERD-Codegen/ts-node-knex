import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article_tag', (table) => {
    table.string('article_tag_id', 64).primary();
    table.string('article_id', 64);
    table.string('tag', 150).index('IX-article_tag_tag');
    table.string('record_status', 10).defaultTo('active');
    table.timestamps(true, true);

    table.unique(['article_id', 'tag']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('article_tag');
}
