package org.jojo.toxictimer.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.jojo.toxictimer.api.exceptions.RunNotFoundExceptions;

public class Run {
	
	private int id;
	private String name;
	private ArrayList<Split> splits;

	public Run(int pId, String pName, ArrayList<Split> pSplits) {
		this.id = pId;
		this.name = pName;
		this.splits = pSplits;
	}

	
	/**
	 * Returns the run with the given id.
	 * @param pRunId The id of the run that should be returned.
	 * @param pSqlConnection The sqlConnection to use.
	 * @return The run associated to the id.
	 * @throws SQLException
	 * @throws RunNotFoundExceptions If there is no run with the given id.
	 */
	public static Run GetRun(int pRunId, Connection pSqlConnection)
			throws SQLException, RunNotFoundExceptions {
		Run run = null;
		Statement runStatement = pSqlConnection.createStatement();
		ResultSet runResult = runStatement
				.executeQuery("SELECT * FROM database.Run WHERE idRun = '"
						+ pRunId + "'");

		if (runResult.next()) {
			run = new Run(pRunId, runResult.getString("name"), Split.GetSplits(
					pRunId, pSqlConnection));
		} else {
			throw new RunNotFoundExceptions(pRunId);
		}
		return run;
	}

}
