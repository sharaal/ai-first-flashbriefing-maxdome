module.exports = ({ maxdome }) => ['get', ['/', async (req, res) => {
  let tipOfTheDay;
  try {
    const tipOfTheDay = (await maxdome.request('tipOfTheDays').send())[0];
    if (!tipOfTheDay) {
      throw new Error('missing tipOfTheDay');
    }
    const review = tipOfTheDay.review;
    if (!review) {
      throw new Error('missing review in tipOfTheDay');
    }
    const asset = review.asset;
    let enhancedTitle = asset.title;
    switch (asset.type) {
      case 'movie':
        enhancedTitle = `Der Film ${asset.title}`;
        break;
      case 'series':
        enhancedTitle = `Die Serie ${asset.title}`;
        break;
    }
    const maxpert = review.maxpert;
    res.send({
      uid: asset.link,
      updateDate: tipOfTheDay.published.toISOString(),
      titleText: `Der Tipp des Tages von ${maxpert.firstname} ${maxpert.surname}: ${enhancedTitle}, ${review.headline}`,
      mainText: asset.description,
      redirectionUrl: asset.link,
    });
  } catch (e) {
    res.send({
      uid: 'Error',
      updateDate: new Date().toISOString(),
      titleText: 'maxdome ist momentan nicht verfügbar',
      mainText: '',
      redirectionUrl: '',
    });
  }
}]];
