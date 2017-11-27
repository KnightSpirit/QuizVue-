import axios from 'axios'

export default {
  axios_ins: axios.create({
    baseURL: 'http://222.171.151.251:9095',
    // baseURL: 'http://localhost:8080',
    timeout: 100000,
    headers: {
      // Authorization: 'Bearer Pejdf5KLOzp3OLdu-axD-PrdrpHrlbji3X7-uwIZ6muY7p7brx8svTlWbyKh7wyuxBEnBfSYqcjvfIw1CuImRoPVoRcUylKZcLYKrwgb_3MKrHW2CS5P_lp2CLtngqGw1NgnLzEZ5VuzQWthKDIF5hwSxhgTSuDHfb1huFpHqEagsTSC_AKQFFXBUy-MdAZanZZu_y-QlW_GfMPzdZ8mwnWEbaFx5auTa_EQX65P7II3ZzAP5XQTC-7ezCKo0h2F8H9dVoAIh-n5xBl-EaLcIkgBj1_dNW69x5o7wZWhS-pffdMFXi0gwwPh0-Y9wa2lGh8zLbkkzkR8hlPGg44ypEnfEmlNxdkz5lUqXCYO_pGvlX3Qq5keZB7HngZl2uhQNt0-YVbp-_BU0keM9dhsUbT09rUO_vN_T_acQwriEkwBdDn-96YJt1lIuPRs2dXq'
    }
  })
}