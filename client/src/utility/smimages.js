const getRandomGangImage = () => {
    return `/gangs-${Math.floor(Math.random() * Math.floor(20))}.jpg`;
}
const getGangImages = () => {
    const images=[];
    for (var i=0;i<21;i++) {
        images.push({url: `/gangs-${i}.jpg`})
    }
    return images;
}
const getRandomGangsterImage = () => {
    return `/gangster-${Math.floor(Math.random() * Math.floor(20))}.jpg`;
}
const getGangsterImages = () => {
    const images=[];
    for (var i=0;i<21;i++) {
        images.push({url: `/gangster-${i}.jpg`})
    }
    return images;
}
const getRandomSubjectImage = () => {
    return `/subject-${Math.floor(Math.random() * Math.floor(20))}.jpg`;
}
const getSubjectImages = () => {
    const images=[];
    for (var i=0;i<21;i++) {
        images.push({url: `/subject-${i}.jpg`})
    }
    return images;
}

module.exports = {
    getRandomGangImage,
    getGangImages,
    getRandomGangsterImage,
    getGangsterImages,
    getRandomSubjectImage,
    getSubjectImages
};