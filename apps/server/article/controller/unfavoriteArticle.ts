import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiUnfavoriteArticle = factory.newAPIUnfavoriteArticle();

export const unfavoriteArticle = async (
	req: Request<Params, unknown, unknown, unknown>,
	res: Response
) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiUnfavoriteArticle.execute({ slug, user });
	return res.json(response);
};

interface Params {
	slug: string;
}
