export type Country = {
    name: string;
    countryId: number;
    population: number;
    states?: State[];
}

export type State = {
    name: string;
    stateId: number;
    countryId: number;
    population: number;
    districts?: District[];
}

export type District = {
    name: string;
    districtId: number;
    stateId: number;
    population: number;
    cities?: City[];
}

export type City = {
    name: string;
    cityId: number;
    districtId: number;
    population: number;
}

export const cities: City[] = [
    // Cities in Kanpur Nagar (DistrictId: 1001)
    { cityId: 10001, districtId: 1001, name: "Kanpur", population: 10000 },
    { cityId: 10002, districtId: 1001, name: "Bilhaur", population: 18000 },
    { cityId: 10003, districtId: 1001, name: "Bithoor", population: 11000 },

    // Cities in Lucknow (DistrictId: 1002)
    { cityId: 10004, districtId: 1002, name: "Lucknow", population: 20000 },
    { cityId: 10005, districtId: 1002, name: "Malihabad", population: 19000 },

    // Cities in Mumbai Suburban (DistrictId: 1003)
    { cityId: 10006, districtId: 1003, name: "Andheri", population: 10000 },
    { cityId: 10007, districtId: 1003, name: "Borivali", population: 12000 },

    // Cities in Pune (DistrictId: 1004)
    { cityId: 10008, districtId: 1004, name: "Pune City", population: 3000 },
    { cityId: 10009, districtId: 1004, name: "Pimpri-Chinchwad", population: 4000 },

    // Cities in Bengaluru Urban (DistrictId: 1005)
    { cityId: 10010, districtId: 1005, name: "Bengaluru", population: 5000 },
    { cityId: 10011, districtId: 1005, name: "Yelahanka", population: 15000 }
];

export const districts: District[] = [
    // Uttar Pradesh Districts (StateId: 101)
    { districtId: 1001, stateId: 101, name: "Kanpur Nagar", population: 0 },
    { districtId: 1002, stateId: 101, name: "Lucknow", population: 0 },
    
    // Maharashtra Districts (StateId: 102)
    { districtId: 1003, stateId: 102, name: "Mumbai Suburban", population: 0 },
    { districtId: 1004, stateId: 102, name: "Pune", population: 0 },

    // Karnataka Districts (StateId: 103)
    { districtId: 1005, stateId: 103, name: "Bengaluru Urban", population: 0 }
];
// --- SAMPLE DATA ---

export const countries: Country[] = [
    { countryId: 1, name: "India", population: 0 }
];

export const states: State[] = [
    { stateId: 101, countryId: 1, name: "Uttar Pradesh", population: 0 },
    { stateId: 102, countryId: 1, name: "Maharashtra", population: 0 },
    { stateId: 103, countryId: 1, name: "Karnataka", population: 0 },
    { stateId: 104, countryId: 1, name: "Tamil Nadu", population: 0 }
];


export const getData = (): Country[] => {

    districts.forEach(district => {
        district.cities = cities.filter(city => city.districtId === district.districtId);
        district.population = district.cities.reduce((total, city) => total + city.population, 0);
    })

    states.forEach(state => {
        state.districts = districts.filter(district => district.stateId === state.stateId);
        state.population = state.districts.reduce((total, district) => total + district.population, 0);
    })

    countries.forEach(country => {
        country.states = states.filter(state => state.countryId === country.countryId);
        country.population = country.states.reduce((total, state) => total + state.population, 0);
    })
    
    return countries;
}