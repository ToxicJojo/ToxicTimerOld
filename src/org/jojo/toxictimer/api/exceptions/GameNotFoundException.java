package org.jojo.toxictimer.api.exceptions;

public class GameNotFoundException extends Exception {

	public GameNotFoundException(int pGameId) {
		super("There is no game with the specified Id(" + pGameId
				+ ") in the database.");
	}
}
