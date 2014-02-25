package org.jojo.toxictimer.api.post;

import java.io.IOException;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;
import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

@WebServlet("/post/Splits")
public class PostSplits extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public PostSplits() {
		super();
		servletName = "post/Splits";
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			try {
				String runnerCode = request.getParameter("runnerCode");
				String splits = request.getParameter("splits");
				String raceId = request.getParameter("raceId");

				if (this.ValidateNumber(runnerCode)
						&& this.ValidateSplits(splits)
						&& this.ValidateNumber(raceId)) {
					if (Race.GetRace(Integer.parseInt(raceId), sqlConnection)
							.IsRunning()) {

						Statement splitStatement = sqlConnection
								.createStatement();

						splitStatement
								.executeUpdate("UPDATE database.runner SET splits = '"
										+ splits
										+ "' WHERE code = "
										+ runnerCode);
						responseCode = HttpServletResponse.SC_OK;
					} else {
						responseCode = HttpServletResponse.SC_BAD_REQUEST;
					}
				} else {
					responseCode = HttpServletResponse.SC_BAD_REQUEST;
				}
			} catch (SQLException e) {
				responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				System.err.println("SQL Error (" + servletName + ")");
				e.printStackTrace();
			} catch (NumberFormatException e) {
				responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
				e.printStackTrace();
			} catch (RunnerNotFoundException e) {
				responseCode = HttpServletResponse.SC_NO_CONTENT;
				e.printStackTrace();
			} catch (RaceNotFoundExcpetion e) {
				responseCode = HttpServletResponse.SC_NO_CONTENT;
				e.printStackTrace();
			}
			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);
	}

}
