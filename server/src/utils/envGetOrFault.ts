const getOrFault = (stringMaybe: string | undefined, name: string | undefined) => {
    if (stringMaybe) {
        return stringMaybe;
    } else {
        console.log(`Unable to load ${name}, aborting process.`);
        process.exit(-1);
    }
};

export default getOrFault;