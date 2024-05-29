/**
 * Copyright 2013-2024 the original author or authors from the Trinity Platform project.
 *
 * This file is part of the Trinity Platform project, see https://www.trinity-technology.com/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const cassandraReservedKeywords = [
  'ADD',
  'ALL',
  'ALTER',
  'AND',
  'ANY',
  'APPLY',
  'AS',
  'ASC',
  'ASCII',
  'AUTHORIZE',
  'BATCH',
  'BEGIN',
  'BIGINT',
  'BLOB',
  'BOOLEAN',
  'BY',
  'CLUSTERING',
  'COLUMNFAMILY',
  'COMPACT',
  'CONSISTENCY',
  'COUNT',
  'COUNTER',
  'CREATE',
  'DECIMAL',
  'DELETE',
  'DESC',
  'DOUBLE',
  'DROP',
  'EACH_QUORUM',
  'FLOAT',
  'FROM',
  'GRANT',
  'IN',
  'INDEX',
  'CUSTOM',
  'INSERT',
  'INT',
  'INTO',
  'KEY',
  'KEYSPACE',
  'LEVEL',
  'LIMIT',
  'LOCAL_ONE',
  'LOCAL_QUORUM',
  'MODIFY',
  'NORECURSIVE',
  'NOSUPERUSER',
  'OF',
  'ON',
  'ONE',
  'ORDER',
  'PASSWORD',
  'PERMISSION',
  'PERMISSIONS',
  'PRIMARY',
  'QUORUM',
  'REVOKE',
  'SCHEMA',
  'SELECT',
  'SET',
  'STORAGE',
  'SUPERUSER',
  'TABLE',
  'TEXT',
  'TIMESTAMP',
  'TIMEUUID',
  'THREE',
  'TOKEN',
  'TRUNCATE',
  'TTL',
  'TWO',
  'TYPE',
  'UPDATE',
  'USE',
  'USER',
  'USERS',
  'USING',
  'UUID',
  'VALUES',
  'VARCHAR',
  'VARINT',
  'WHERE',
  'WITH',
  'WRITETIME',
  'DISTINCT',
  'BYTE',
  'SMALLINT',
  'COMPLEX',
  'ENUM',
  'DATE',
  'INTERVAL',
  'MACADDR',
  'BITSTRING',
];

export const isReservedCassandraKeyword = (keyword: string) => {
  return cassandraReservedKeywords.includes(keyword.toUpperCase());
};
