package org.jojo.toxictimer.api.exceptions;

public class RunNotFoundException extends Exception {

	public RunNotFoundException(int pRunId) {
		super("There is no run with the specified Id(" + pRunId
				+ ") in the database.");
	}
}
