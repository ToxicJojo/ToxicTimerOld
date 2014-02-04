package org.jojo.toxictimer.api.get;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;
import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

@WebServlet("/get/RaceList")
public class GetRaceList extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public GetRaceList() {
		super();
		servletName = "get/RaceList";
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			if (this.SetUpWriter(response, request)) {
				try {
					this.WriteResponse(Race.GetRaceList(sqlConnection));
				} catch (SQLException e) {
					responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
					System.err.println("SQL Error (" + servletName + ")");
					e.printStackTrace();
				} catch (RunnerNotFoundException e) {
					responseCode = HttpServletResponse.SC_NO_CONTENT;
					e.printStackTrace();
				} catch (RaceNotFoundExcpetion e) {
					responseCode = HttpServletResponse.SC_NO_CONTENT;
					e.printStackTrace();
				}
			}
			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);
	}

}
