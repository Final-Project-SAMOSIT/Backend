const { Prisma } = require("@prisma/client")

module.exports = (error, status = 500, res) => {
    if (error instanceof Prisma.PrismaClientValidationError) {
        res.status(500).send({ error: `PrismaClientValidationError`, message: error.message })
    }
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        res.status(500).send({ error: `PrismaClientUnknownRequestError`, message: error.message })
    }
    if (error instanceof Prisma.PrismaClientRustPanicError) {
        res.status(500).send({ error: `PrismaClientRustPanicError`, message: error.message })
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
        res.status(500).send({ error: `PrismaClientInitializationError`, message: error.message })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        let { code: errorCode, meta } = error
        let message = Object.values(meta)[0]
        let errorMessage
        switch (errorCode) {
            case "P2000":
                errorMessage = `P2000: The provided value for the column is too long for the column's type. Column: ${message}`
                break;
            case "P2001":
                errorMessage = `P2001: The record searched for in the where condition (${meta.model_name}.${meta.argument_name} = ${meta.argument_value}) does not exist`
                break;
            case "P2002":
                errorMessage = `P2002: Unique constraint failed on the ${message}`
                break;
            case "P2003":
                errorMessage = `P2003: Foreign key constraint failed on the field: ${message}`
                break;
            case "P2004":
                errorMessage = `P2004: A constraint failed on the database: ${message}`
                break;
            case "P2005":
                errorMessage = `P2005: The value ${meta.field_value} stored in the database for the field ${meta.field_name} is invalid for the field's type`
                break;
            case "P2006":
                errorMessage = `P2006: The provided value ${meta.field_value} for ${meta.model_name} field ${meta.field_name} is not valid`
                break;
            case "P2007":
                errorMessage = `P2007: Data validation error ${message}`
                break;
            case "P2008":
                errorMessage = `P2008: Failed to parse the query ${meta.query_parsing_error} at ${meta.query_position}`
                break;
            case "P2009":
                errorMessage = `P2009: Failed to validate the query: ${meta.query_validation_error} at ${meta.query_position}`
                break;
            case "P2010":
                errorMessage = `P2010: Raw query failed. Code: ${meta.code}. Message: ${meta.message}`
                break;
            case "P2011":
                errorMessage = `P2011: Null constraint violation on the ${message}`
                break;
            case "P2012":
                errorMessage = `P2012: Missing a required value at ${message}`
                break;
            case "P2013":
                errorMessage = `P2013: Missing the required argument ${meta.argument_name} for field ${meta.field_name} on ${meta.object_name}.`
                break;
            case "P2014":
                errorMessage = `P2014: The change you are trying to make would violate the required relation '${meta.relation_name}' between the ${meta.model_a_name} and ${meta.model_b_name} models.`
                break;
            case "P2015":
                errorMessage = `P2015: A related record could not be found. ${message}`
                break;
            case "P2016":
                errorMessage = `P2016: Query interpretation error. ${message}`
                break;
            case "P2017":
                errorMessage = `P2017: The records for relation ${meta.relation_name} between the ${meta.parent_name} and ${meta.child_name} models are not connected.`
                break;
            case "P2018":
                errorMessage = `P2018: The required connected records were not found. ${message}`
                break;
            case "P2019":
                errorMessage = `P2019: Input error. ${message}`
                break;
            case "P2020":
                errorMessage = `P2020: Value out of range for the type. ${message}`
                break;
            case "P2021":
                errorMessage = `P2021: The table ${message} does not exist in the current database.`
                break;
            case "P2022":
                errorMessage = `P2022: The column ${message} does not exist in the current database.`
                break;
            case "P2023":
                errorMessage = `P2023: Inconsistent column data: ${message}`
                break;
            case "P2024":
                errorMessage = `P2024: Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool, Current connection limit: ${meta.connection_limit})`
                break;
            case "P2025":
                errorMessage = `P2025: An operation failed because it depends on one or more records that were required but not found. ${message}`
                break;
            case "P2026":
                errorMessage = `P2026: The current database provider doesn't support a feature that the query used: ${message}`
                break;
            case "P2027":
                errorMessage = `P2027: Multiple errors occurred on the database during query execution: ${message}`
                break;
            case "P2030":
                errorMessage = `P2030: Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema`
                break;
            case "P2033":
                errorMessage = `P2033: A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers`
                break;
            default:
                errorMessage = `An error occurred: ${error}`
                break;
        }
        return res.status(500).send({ error: errorMessage })
    }
}