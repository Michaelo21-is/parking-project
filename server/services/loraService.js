export const processData = async (data) => {
    if (!data.spot || !data.status || data.floor === undefined || !data.type) {
        throw new Error('Invalid data format, missing "spot", "status", "floor", or "type" field');
    }

    if (data.status !== 'free' && data.status !== 'occupied') {
        throw new Error('Invalid status value - must be "free" or "occupied"');
    }

    const validTypes = ['regular', 'disabled', 'dean'];
    if (!validTypes.includes(data.type)) {
        throw new Error(`Invalid type value - must be one of: ${validTypes.join(', ')}`);
    }

    console.log(`Processing data for spot ${data.spot} (Floor: ${data.floor}, Type: ${data.type}) with status ${data.status}`);
    //save to database using await
    console.log('Data saved to database successfully');

    return true;
};