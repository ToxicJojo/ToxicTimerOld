package org.jojo.toxictimer.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class Split {

	private String name;

	public Split(String pName) {
		this.name = pName;
	}

	/**
	 * Returns an ArrayList containing the splits associated to the given runId.
	 * @param pRunId The id of the run the splits should be loaded from.
	 * @param pSqlConnection The sqlConnection to use.
	 * @return An ArrayList containing the splits.
	 * @throws SQLException
	 */
	public static ArrayList<Split> GetSplits(int pRunId, Connection pSqlConnection) throws SQLException {
		ArrayList<Split> splits = new ArrayList<Split>();

		Statement runStatement = pSqlConnection.createStatement();
		ResultSet runResult = runStatement
				.executeQuery("SELECT * FROM database.Split WHERE idRun = '"
						+ pRunId + "'");

		while (runResult.next()) {
			splits.add(new Split(runResult.getString("name")));
		}
		
		return splits;
	}
	
	public static ArrayList<Long> ParseSplits(String pSplits) {
		ArrayList<Long> splits = new ArrayList<Long>();
		for (String split : pSplits.split(";")) {
			splits.add(Long.parseLong(split));
		}
		return splits;
	}
	
}
