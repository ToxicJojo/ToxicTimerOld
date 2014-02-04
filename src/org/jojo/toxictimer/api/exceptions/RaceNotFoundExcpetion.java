package org.jojo.toxictimer.api.exceptions;

public class RaceNotFoundExcpetion extends Exception {

	public RaceNotFoundExcpetion(int pRaceId) {
		super("There is no race with the specified Id(" + pRaceId
				+ ") in the database.");
	}
}
