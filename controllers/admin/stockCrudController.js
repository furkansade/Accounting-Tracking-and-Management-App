const createModel = (Model) => async (req, res) => {
    try {
        Object.keys(req.body).forEach(key => {
            // Check if the field is either parentCategory or category and if its value is an empty string
            if ((key === 'parentCategory' || key === 'category') && req.body[key] === '') {
                req.body[key] = null;
            }
        });

        if (req.body['orderProducts[0][orderProduct]'] !== undefined) {
            const orderProducts = [];
        Object.keys(req.body).forEach(key => {
            const match = key.match(/orderProducts\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
                orderProducts[index] = orderProducts[index] || {};
                orderProducts[index][field] = req.body[key];
            }
        });

        // Filter out any products without an orderProduct
        req.body.orderProducts = orderProducts.filter(product => product.orderProduct);

        }

        await Model.create(req.body);

        req.flash("success", "Başarıyla oluşturuldu!");

        if (Model.collection.name === "categories") {
            return res.status(201).redirect("/admin/products");
        }
        res.status(201).redirect(`/admin/${Model.collection.name}`);

    } catch (error) {
        console.log(error);
        req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
        res.status(500).redirect('back');
    }
};

const deleteOne = (Model) => async (req, res) => {
    try {
        const model = await Model.findById(req.params.id);

        if (!model) {
            return res.status(404).json({
                status: 'fail',
                message: 'Model not found'
            });
        }

        await Model.findByIdAndDelete(req.params.id);

        req.flash("success", "Başarıyla silindi!");


        if (Model.collection.name === "categories") {
            return res.status(201).redirect("/admin/products");
        }

        if (Model.collection.name === "customertransactions") {
            return res.status(204).redirect(`/admin/customers/${model.customer}`);
        }

        if (Model.collection.name === "cashledgers") {
            return res.status(204).redirect(`/admin/cash-ledger`);
        }

        res.status(204).redirect(`/admin/${Model.collection.name}`);
    } catch (error) {
        req.flash("error", "Bir hata oluştu. Lütfen tekrar deneyin.");
        res.status(500).redirect('back');
    }
};

module.exports = { createModel: createModel, deleteOne: deleteOne }