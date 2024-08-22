export function useBusinessApi() {
    function getBusinessDetails(): BusinessDetails {
        return <BusinessDetails>{
            name: "Masonry Contractor",
            location: { address: "1234 Central St", city: "Phoenix", state: "AZ", zip: "72000" },
            phone: "123-456-7890",
            email: "contractor@business.com",
            website: "contractor.com",
            license: "#0000001"
        };
    }

    return { getBusinessDetails };
}