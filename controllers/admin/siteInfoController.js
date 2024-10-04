const SiteInfo = require('../../models/SiteInfo.js');

exports.updateSiteInfo = async (req, res) => {
    try {
        const siteInfo = await SiteInfo.findOneAndUpdate({}, {new: true});

        siteInfo.title = req.body.title;
        siteInfo.description = req.body.description;
        siteInfo.email = req.body.email;
        siteInfo.phone = req.body.phone;
        siteInfo.address = req.body.address;
        siteInfo.socialMedia.twitter = req.body.twitter;
        siteInfo.socialMedia.linkedin = req.body.linkedin;
        siteInfo.socialMedia.instagram = req.body.instagram;
        siteInfo.socialMedia.youtube = req.body.youtube;

        await siteInfo.save();

        res.status(200).redirect('/admin/site-info');
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};