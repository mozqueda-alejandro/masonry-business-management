export { };

declare global {
    interface BusinessDetails {
        name: string;
        location: Location;
        phone: string;
        email: string;
        website: string;
        license: string;
    }

    interface Client {
        id?: number;
        name: string;
        address: string;
        // lastName: string;
        email: string;
        phone: string;
    }

    interface Location {
        id?: number;
        address: string;
        city: string;
        state: string;
        zip: string;
    }
}