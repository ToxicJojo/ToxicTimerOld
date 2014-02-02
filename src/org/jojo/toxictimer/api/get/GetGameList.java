package org.jojo.toxictimer.api.get;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Game;
import org.jojo.toxictimer.api.exceptions.GameNotFoundException;
import org.jojo.toxictimer.api.exceptions.RunNotFoundExceptions;

@WebServlet("/get/GameList")
public class GetGameList extends BaseServlet {
	private static final long serialVersionUID = 1L;

	public GetGameList() {
		super();
		servletName = "get/GameList";
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			if (this.SetUpWriter(response, request)) {
				try {		
					this.WriteResponse(Game.GetGameList(sqlConnection));
				} catch (SQLException e) {
					responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
					System.err.println("SQL Error in (" + servletName + ")");
					e.printStackTrace();
				} catch (RunNotFoundExceptions e) {
					responseCode = HttpServletResponse.SC_NOT_FOUND;
					e.printStackTrace();
				} catch (GameNotFoundException e) {
					responseCode = HttpServletResponse.SC_NOT_FOUND;
					e.printStackTrace();
				}
			}
			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);
	}

}
