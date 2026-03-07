import userModel from "../../model/authmodel/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;   
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            userData: {
                fullName: user.fullName,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

