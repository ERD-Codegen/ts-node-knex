import { isNil } from "lodash";

import { DbDtoUser } from "@conduit/core/database/dto";
import { UserService } from "@conduit/core/service";
import { InvalidFollowError } from "@conduit/core/service/user/error";
import {
	APIErrorBadRequest,
	APIErrorInternalServerError,
	APIErrorNotFound,
	logger
} from "@conduit/utils";

import { ErrorCodes } from "../../constants";
import { DtoProfile } from "../dto";

export class APIUnfollowUser {
	private userService: UserService;

	constructor({ userService }: APIUnfollowUserConstructor) {
		this.userService = userService;
	}

	/**
	 *
	 * Executes the unfollow user API endpoint.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing user and username.
	 * @param {Object} input.user - The user object.
	 * @param {string} input.username - The username of the user to be unfollowed.
	 *
	 * @returns {Promise<Object>} The promise object representing the API unfollow user output.
	 *
	 * @throws {APIErrorNotFound} If the targeted user is not found.
	 * @throws {APIErrorBadRequest} If there is an invalid follow error.
	 * @throws {APIErrorInternalServerError} If there is an internal server error.
	 *
	 */
	async execute({
		user,
		username
	}: APIUnfollowUserInput): Promise<APIUnfollowUserOutput> {
		const targeted = await this.userService.getUserByUsername({ username });
		APIErrorNotFound.assert({
			condition: !isNil(targeted),
			errorCode: ErrorCodes.NotFound,
			message: "Sorry, we could not find the user you are looking for."
		});
		try {
			await this.userService.unfollowUser({
				followerId: user.id,
				followingId: targeted!.id
			});
			const profile = new DtoProfile({
				dbDtoUser: targeted!,
				following: false
			});
			return { profile };
		} catch (error) {
			if (error instanceof InvalidFollowError) {
				throw new APIErrorBadRequest({
					message: error.message,
					cause: error
				});
			}
			logger.error(error);
			throw new APIErrorInternalServerError({});
		}
	}
}

interface APIUnfollowUserConstructor {
	userService: UserService;
}

interface APIUnfollowUserInput {
	username: string;
	user: DbDtoUser;
}

interface APIUnfollowUserOutput {
	profile: DtoProfile;
}
