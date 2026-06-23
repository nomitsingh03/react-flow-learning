type Country = {
    name: string;
    countryId: number;
    states?: State[];
}

type State = {
    name: string;
    stateId: number;
    countryId: number;
    population: number;
    districts?: District[];
}

type District = {
    name: string;
    districtId: number;
    stateId: number;
    population: number;
    cities?: City[];
}

type City = {
    name: string;
    cityId: number;
    districtId: number;
    population: number;
}

export const cities: City[] = [
    // Cities in Kanpur Nagar (DistrictId: 1001)
    { cityId: 10001, districtId: 1001, name: "Kanpur", population: 2765000 },
    { cityId: 10002, districtId: 1001, name: "Bilhaur", population: 18000 },
    { cityId: 10003, districtId: 1001, name: "Bithoor", population: 11000 },

    // Cities in Lucknow (DistrictId: 1002)
    { cityId: 10004, districtId: 1002, name: "Lucknow", population: 2902000 },
    { cityId: 10005, districtId: 1002, name: "Malihabad", population: 19000 },

    // Cities in Mumbai Suburban (DistrictId: 1003)
    { cityId: 10006, districtId: 1003, name: "Andheri", population: 1500000 },
    { cityId: 10007, districtId: 1003, name: "Borivali", population: 513000 },

    // Cities in Pune (DistrictId: 1004)
    { cityId: 10008, districtId: 1004, name: "Pune City", population: 3124000 },
    { cityId: 10009, districtId: 1004, name: "Pimpri-Chinchwad", population: 1727000 },

    // Cities in Bengaluru Urban (DistrictId: 1005)
    { cityId: 10010, districtId: 1005, name: "Bengaluru", population: 8443000 },
    { cityId: 10011, districtId: 1005, name: "Yelahanka", population: 300000 }
];

export const districts: District[] = [
    // Uttar Pradesh Districts (StateId: 101)
    { districtId: 1001, stateId: 101, name: "Kanpur Nagar", population: 4581000 },
    { districtId: 1002, stateId: 101, name: "Lucknow", population: 4589000 },
    
    // Maharashtra Districts (StateId: 102)
    { districtId: 1003, stateId: 102, name: "Mumbai Suburban", population: 9356000 },
    { districtId: 1004, stateId: 102, name: "Pune", population: 9429000 },

    // Karnataka Districts (StateId: 103)
    { districtId: 1005, stateId: 103, name: "Bengaluru Urban", population: 9621000 }
];
// --- SAMPLE DATA ---

export const countries: Country[] = [
    { countryId: 1, name: "India" }
];

export const states: State[] = [
    { stateId: 101, countryId: 1, name: "Uttar Pradesh", population: 241000000 },
    { stateId: 102, countryId: 1, name: "Maharashtra", population: 125000000 },
    { stateId: 103, countryId: 1, name: "Karnataka", population: 68000000 }
];


export const getData = (): Country[] => {

    districts.forEach(district => {
        district.cities = cities.filter(city => city.districtId === district.districtId);
    })

    states.forEach(state => {
        state.districts = districts.filter(district => district.stateId === state.stateId);
    })

    countries.forEach(country => {
        country.states = states.filter(state => state.countryId === country.countryId);
    })
    
    return countries;
}