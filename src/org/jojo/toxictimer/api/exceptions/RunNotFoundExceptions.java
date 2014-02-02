package org.jojo.toxictimer.api.exceptions;

public class RunNotFoundExceptions extends Exception {

	public RunNotFoundExceptions(int pRunId) {
		super("There is no run with the specified Id(" + pRunId
				+ ") in the database.");
	}
}
