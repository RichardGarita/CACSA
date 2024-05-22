function convertToLocaleDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };

    // Convertir a hora local y formatear como fecha y hora
    const formattedDateTime = date.toLocaleString(undefined, options);

    return formattedDateTime;
}

module.exports = {
    convertToLocaleDateTime,
}
